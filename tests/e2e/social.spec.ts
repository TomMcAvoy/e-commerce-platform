import { test, expect } from '@playwright/test';

test.describe('Social Network Features', () => {
  test('should display social feed', async ({ page }) => {
    await page.goto('/social');
    
    // Should show social posts
    await expect(page.locator('[data-testid="social-post"]').first()).toBeVisible();
  });

  test('should create new post', async ({ page }) => {
    await page.goto('/social');
    
    // Click create post
    await page.click('button:has-text("Create Post")');
    
    // Fill post content
    await page.fill('[data-testid="post-content"]', 'Test social post');
    
    // Submit post
    await page.click('button:has-text("Post")');
    
    // Should show success message
    await expect(page.locator('text=Post created')).toBeVisible();
  });

  test('should like a post', async ({ page }) => {
    await page.goto('/social');
    
    // Click like button
    await page.locator('[data-testid="like-button"]').first().click();
    
    // Should update like count
    await expect(page.locator('[data-testid="like-count"]').first()).toContainText('1');
  });

  test('should comment on post', async ({ page }) => {
    await page.goto('/social');
    
    // Click comment button
    await page.locator('[data-testid="comment-button"]').first().click();
    
    // Add comment
    await page.fill('[data-testid="comment-input"]', 'Test comment');
    await page.click('button:has-text("Comment")');
    
    // Should show comment
    await expect(page.locator('text=Test comment')).toBeVisible();
  });

  test('should follow user', async ({ page }) => {
    await page.goto('/social');
    
    // Click follow button
    await page.locator('[data-testid="follow-button"]').first().click();
    
    // Should change to following
    await expect(page.locator('text=Following')).toBeVisible();
  });
});