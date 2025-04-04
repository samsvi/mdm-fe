import { newSpecPage } from '@stencil/core/testing';
import { SamsviMdmPatientList } from '../samsvi-mdm-patient-list';

describe('samsvi-mdm-patient-list', () => {
  it('renders patient list with correct content', async () => {
    const page = await newSpecPage({
      components: [SamsviMdmPatientList],
      html: `<samsvi-patient-list></samsvi-patient-list>`,
    });

    const shadowRoot = page.root.shadowRoot;

    // Over nadpis
    const heading = shadowRoot.querySelector('h2');
    expect(heading).not.toBeNull();
    expect(heading.textContent).toBe('Zoznam pacientov');
  });
});
