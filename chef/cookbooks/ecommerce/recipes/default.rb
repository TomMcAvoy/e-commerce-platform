# Chef Cookbook for E-Commerce Platform
# File: cookbooks/ecommerce/recipes/default.rb

# Update package lists
apt_update 'update packages' do
  action :update
end

# Install system packages
package %w(curl git nginx certbot python3-certbot-nginx build-essential) do
  action :install
end

# Install Node.js
nodejs_install 'nodejs' do
  version '18.17.0'
  checksum_linux_x64 '4b8ecbb0c25a5b5c9c6af6b0024e9b1a36d22db6a2e2b7b6c4bc2b8f8b8a8b8b'
end

# Create application user
user 'ecommerce' do
  home '/var/www/ecommerce'
  shell '/bin/bash'
  system true
  action :create
end

# Create application directory
directory '/var/www/ecommerce' do
  owner 'ecommerce'
  group 'ecommerce'
  mode '0755'
  action :create
end

# Clone application repository
git '/var/www/ecommerce' do
  repository 'https://github.com/yourusername/shoppingcart.git'
  revision 'main'
  user 'ecommerce'
  group 'ecommerce'
  action :sync
  notifies :run, 'execute[npm install]', :immediately
  notifies :run, 'execute[npm build]', :immediately
end

# Install npm dependencies
execute 'npm install' do
  command 'npm install --production'
  cwd '/var/www/ecommerce'
  user 'ecommerce'
  group 'ecommerce'
  action :nothing
end

# Build application
execute 'npm build' do
  command 'npm run build'
  cwd '/var/www/ecommerce'
  user 'ecommerce'
  group 'ecommerce'
  action :nothing
end

# MongoDB installation and configuration
apt_repository 'mongodb' do
  uri 'https://repo.mongodb.org/apt/ubuntu'
  distribution 'focal/mongodb-org/6.0'
  components ['multiverse']
  keyserver 'hkp://keyserver.ubuntu.com:80'
  key 'D68FA50FEA312927'
  action :add
end

package 'mongodb-org' do
  action :install
end

service 'mongod' do
  action [:enable, :start]
end

# Redis installation and configuration
package 'redis-server' do
  action :install
end

template '/etc/redis/redis.conf' do
  source 'redis.conf.erb'
  mode '0644'
  notifies :restart, 'service[redis-server]'
end

service 'redis-server' do
  action [:enable, :start]
end

# Application environment configuration
template '/var/www/ecommerce/.env' do
  source 'env.erb'
  owner 'ecommerce'
  group 'ecommerce'
  mode '0600'
  variables(
    mongodb_uri: node['ecommerce']['mongodb_uri'] || 'mongodb://localhost:27017/ecommerce',
    redis_url: node['ecommerce']['redis_url'] || 'redis://localhost:6379',
    jwt_secret: node['ecommerce']['jwt_secret'] || 'your-super-secret-jwt-key',
    port: node['ecommerce']['port'] || '3000'
  )
  notifies :restart, 'service[ecommerce]'
end

# Systemd service configuration
template '/etc/systemd/system/ecommerce.service' do
  source 'ecommerce.service.erb'
  mode '0644'
  variables(
    app_path: '/var/www/ecommerce',
    user: 'ecommerce',
    group: 'ecommerce'
  )
  notifies :run, 'execute[systemd-reload]', :immediately
  notifies :restart, 'service[ecommerce]'
end

execute 'systemd-reload' do
  command 'systemctl daemon-reload'
  action :nothing
end

service 'ecommerce' do
  action [:enable, :start]
end

# Nginx configuration
template '/etc/nginx/sites-available/ecommerce' do
  source 'nginx.conf.erb'
  mode '0644'
  variables(
    server_name: node['ecommerce']['domain'] || 'localhost',
    app_port: node['ecommerce']['port'] || '3000'
  )
  notifies :restart, 'service[nginx]'
end

# Remove default Nginx site
file '/etc/nginx/sites-enabled/default' do
  action :delete
  notifies :restart, 'service[nginx]'
end

# Enable ecommerce site
link '/etc/nginx/sites-enabled/ecommerce' do
  to '/etc/nginx/sites-available/ecommerce'
  notifies :restart, 'service[nginx]'
end

service 'nginx' do
  action [:enable, :start]
end

# SSL certificate (if domain is configured)
execute 'obtain ssl certificate' do
  command "certbot --nginx -d #{node['ecommerce']['domain']} --non-interactive --agree-tos --email #{node['ecommerce']['admin_email']}"
  only_if { node['ecommerce']['domain'] && node['ecommerce']['admin_email'] }
  not_if "certbot certificates | grep -q #{node['ecommerce']['domain']}"
end

# Firewall configuration using ufw
package 'ufw' do
  action :install
end

execute 'ufw allow ssh' do
  command 'ufw allow 22/tcp'
  not_if 'ufw status | grep -q "22/tcp"'
end

execute 'ufw allow http' do
  command 'ufw allow 80/tcp'
  not_if 'ufw status | grep -q "80/tcp"'
end

execute 'ufw allow https' do
  command 'ufw allow 443/tcp'
  not_if 'ufw status | grep -q "443/tcp"'
end

execute 'enable ufw' do
  command 'echo "y" | ufw enable'
  not_if 'ufw status | grep -q "Status: active"'
end

# Log rotation for application logs
template '/etc/logrotate.d/ecommerce' do
  source 'logrotate.erb'
  mode '0644'
end

# Monitoring and health checks
cron 'health check' do
  minute '*/5'
  command 'curl -f http://localhost:3000/health || systemctl restart ecommerce'
  user 'root'
end

# Create maintenance scripts
template '/usr/local/bin/ecommerce-backup.sh' do
  source 'backup.sh.erb'
  mode '0755'
  variables(
    app_path: '/var/www/ecommerce',
    backup_path: '/var/backups/ecommerce'
  )
end

# Schedule daily backups
cron 'daily backup' do
  hour '2'
  minute '0'
  command '/usr/local/bin/ecommerce-backup.sh'
  user 'root'
end

# Performance tuning
template '/etc/security/limits.d/ecommerce.conf' do
  source 'limits.conf.erb'
  mode '0644'
end

# Install monitoring tools
package %w(htop iotop nethogs) do
  action :install
end
