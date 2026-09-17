import os
import time
from playwright.sync_api import sync_playwright

dest_dir = r'C:\Users\qwert\.gemini\antigravity\brain\e2956926-351e-4085-b01b-00b865904a30\screenshots'
os.makedirs(dest_dir, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(channel='chrome', headless=True)
    context = browser.new_context(viewport={'width': 1366, 'height': 820})
    page = context.new_page()

    # 1. Landing Page
    print('1. Testing Landing Page...')
    page.goto('http://localhost:5000/', wait_until='networkidle')
    page.wait_for_timeout(2000)
    page.screenshot(path=os.path.join(dest_dir, 'clone_01_landing.png'), full_page=False)
    print('Captured clone_01_landing.png')

    # 2. Live Card Demo
    print('2. Testing Public Card View...')
    page.click('button:has-text("Live Card Demo")')
    page.wait_for_timeout(2000)
    page.screenshot(path=os.path.join(dest_dir, 'clone_02_card_view.png'))
    print('Captured clone_02_card_view.png')

    # 3. Switch Theme on Card
    print('3. Testing Theme Switcher...')
    # Select another theme from dropdown
    page.select_option('select', value='5') # Cyberpunk 2077
    page.wait_for_timeout(1500)
    page.screenshot(path=os.path.join(dest_dir, 'clone_03_cyber_theme.png'))
    print('Captured clone_03_cyber_theme.png')

    # 4. Customer Login & Dashboard
    print('4. Testing Customer Portal...')
    page.click('button:has-text("← Back")')
    page.wait_for_timeout(1000)
    page.click('button:has-text("Customer")') # Top bar quick login
    page.wait_for_timeout(2000)
    page.screenshot(path=os.path.join(dest_dir, 'clone_04_customer_dashboard.png'))
    print('Captured clone_04_customer_dashboard.png')

    # 5. Card Builder
    print('5. Testing Card Builder Wizard...')
    page.click('button:has-text("Edit")')
    page.wait_for_timeout(2000)
    page.screenshot(path=os.path.join(dest_dir, 'clone_05_card_builder.png'))
    print('Captured clone_05_card_builder.png')

    # 6. Franchisee Portal
    print('6. Testing Franchisee Portal...')
    page.click('button:has-text("Back to Dashboard")')
    page.wait_for_timeout(1000)
    page.click('button:has-text("Franchisee")') # Top bar quick login
    page.wait_for_timeout(2000)
    page.screenshot(path=os.path.join(dest_dir, 'clone_06_franchisee_dashboard.png'))
    print('Captured clone_06_franchisee_dashboard.png')

    # 7. Super Admin Portal
    print('7. Testing Super Admin Portal...')
    page.click('button:has-text("Admin")') # Top bar quick login
    page.wait_for_timeout(2000)
    page.screenshot(path=os.path.join(dest_dir, 'clone_07_admin_dashboard.png'))
    print('Captured clone_07_admin_dashboard.png')

    # 8. Admin Recharge Wallet
    print('8. Testing Admin Recharge Wallet...')
    page.click('button:has-text("Recharge Wallet")')
    page.wait_for_timeout(1500)
    page.screenshot(path=os.path.join(dest_dir, 'clone_08_admin_recharge.png'))
    print('Captured clone_08_admin_recharge.png')

    browser.close()
    print('All Playwright tests passed & screenshots captured!')
