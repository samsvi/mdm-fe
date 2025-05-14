import { newE2EPage } from '@stencil/core/testing';

describe('samsvi-mdm-table-controls', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<samsvi-mdm-table-controls></samsvi-mdm-table-controls>');

    const element = await page.find('samsvi-mdm-table-controls');
    expect(element).toHaveClass('hydrated');
  });
});
