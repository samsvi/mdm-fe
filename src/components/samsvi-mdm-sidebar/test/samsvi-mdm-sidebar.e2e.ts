import { newE2EPage } from '@stencil/core/testing';

describe('samsvi-mdm-sidebar', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<samsvi-mdm-sidebar></samsvi-mdm-sidebar>');

    const element = await page.find('samsvi-mdm-sidebar');
    expect(element).toHaveClass('hydrated');
  });
});
