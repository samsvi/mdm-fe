import { newE2EPage } from '@stencil/core/testing';

describe('samsvi-mdm-stats', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<samsvi-mdm-stats></samsvi-mdm-stats>');

    const element = await page.find('samsvi-mdm-stats');
    expect(element).toHaveClass('hydrated');
  });
});
