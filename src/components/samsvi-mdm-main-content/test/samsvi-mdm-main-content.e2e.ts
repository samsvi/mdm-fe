import { newE2EPage } from '@stencil/core/testing';

describe('samsvi-mdm-main-content', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<samsvi-mdm-main-content></samsvi-mdm-main-content>');

    const element = await page.find('samsvi-mdm-main-content');
    expect(element).toHaveClass('hydrated');
  });
});
