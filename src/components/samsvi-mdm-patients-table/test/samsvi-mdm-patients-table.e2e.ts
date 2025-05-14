import { newE2EPage } from '@stencil/core/testing';

describe('samsvi-mdm-patients-table', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<samsvi-mdm-patients-table></samsvi-mdm-patients-table>');

    const element = await page.find('samsvi-mdm-patients-table');
    expect(element).toHaveClass('hydrated');
  });
});
