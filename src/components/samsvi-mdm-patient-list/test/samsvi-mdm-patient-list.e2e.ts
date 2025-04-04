import { newE2EPage } from '@stencil/core/testing';

describe('samsvi-mdm-patient-list', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<samsvi-mdm-patient-list></samsvi-mdm-patient-list>');

    const element = await page.find('samsvi-mdm-patient-list');
    expect(element).toHaveClass('hydrated');
  });
});
