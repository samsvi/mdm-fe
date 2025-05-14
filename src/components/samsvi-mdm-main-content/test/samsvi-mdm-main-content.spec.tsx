import { newSpecPage } from '@stencil/core/testing';
import { SamsviMdmMainContent } from '../samsvi-mdm-main-content';

describe('samsvi-mdm-main-content', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [SamsviMdmMainContent],
      html: `<samsvi-mdm-main-content></samsvi-mdm-main-content>`,
    });
    expect(page.root).toEqualHtml(`
      <samsvi-mdm-main-content>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </samsvi-mdm-main-content>
    `);
  });
});
