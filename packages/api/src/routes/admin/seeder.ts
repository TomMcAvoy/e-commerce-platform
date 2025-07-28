import { Router } from 'express';
import { spawn } from 'child_process';
import path from 'path';

const router = Router();

/**
 * POST /api/admin/run-seeder
 * Runs the database seeder
 */
router.post('/run-seeder', async (req, res) => {
  try {
    // Path to the seeder script
    const seederPath = path.resolve(__dirname, '../../seeders/ComprehensiveSeeder.ts');
    
    // Spawn the seeder process
    const seeder = spawn('npx', ['ts-node', seederPath], {
      cwd: process.cwd(),
      env: process.env
    });
    
    let output = '';
    let errorOutput = '';
    
    // Collect stdout
    seeder.stdout.on('data', (data) => {
      const chunk = data.toString();
      output += chunk;
      console.log(chunk);
    });
    
    // Collect stderr
    seeder.stderr.on('data', (data) => {
      const chunk = data.toString();
      errorOutput += chunk;
      console.error(chunk);
    });
    
    // Handle process completion
    seeder.on('close', (code) => {
      if (code === 0) {
        res.json({
          success: true,
          output: output
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Seeder process exited with code ' + code,
          output: output,
          errorOutput: errorOutput
        });
      }
    });
    
    // Handle process errors
    seeder.on('error', (error) => {
      res.status(500).json({
        success: false,
        error: 'Failed to start seeder process: ' + error.message
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error: ' + error.message
    });
  }
});

export default router;