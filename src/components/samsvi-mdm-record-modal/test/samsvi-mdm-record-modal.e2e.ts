import { newE2EPage } from '@stencil/core/testing';

describe('samsvi-mdm-record-modal', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<samsvi-mdm-record-modal></samsvi-mdm-record-modal>');

    const element = await page.find('samsvi-mdm-record-modal');
    expect(element).toHaveClass('hydrated');
  });
});
