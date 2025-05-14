import { newE2EPage } from '@stencil/core/testing';

describe('samsvi-mdm-header', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<samsvi-mdm-header></samsvi-mdm-header>');

    const element = await page.find('samsvi-mdm-header');
    expect(element).toHaveClass('hydrated');
  });
});
