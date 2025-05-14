import { newSpecPage } from '@stencil/core/testing';
import { SamsviMdmTableControls } from '../samsvi-mdm-table-controls';

describe('samsvi-mdm-table-controls', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SamsviMdmTableControls],
      html: `<samsvi-mdm-table-controls></samsvi-mdm-table-controls>`,
    });
    expect(page.root).toEqualHtml(`
      <samsvi-mdm-table-controls>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </samsvi-mdm-table-controls>
    `);
  });
});
