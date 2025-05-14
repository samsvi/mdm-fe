import { newSpecPage } from '@stencil/core/testing';
import { SamsviMdmPatientsTable } from '../samsvi-mdm-patients-table';

describe('samsvi-mdm-patients-table', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SamsviMdmPatientsTable],
      html: `<samsvi-mdm-patients-table></samsvi-mdm-patients-table>`,
    });
    expect(page.root).toEqualHtml(`
      <samsvi-mdm-patients-table>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </samsvi-mdm-patients-table>
    `);
  });
});
