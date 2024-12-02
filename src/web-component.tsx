import { createRoot } from "react-dom/client"
import { Widget, WidgetProps } from "./components/Widget"

const normalizeAttribute = (attribute: string) => {
  return attribute.replace(/-([a-z])/g, (_: unknown, letter: string) => letter.toUpperCase())
}

class WidgetWebComponent extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: "open" })
  }

  connectedCallback() {
    const props = this.getPropsFromAttributes()
    if (this.shadowRoot) {
      const root = createRoot(this.shadowRoot)
      root.render(<Widget {...props} />)
    }
  }

  getPropsFromAttributes() {
    const props: WidgetProps = {}
    for (const { name, value } of this.attributes) {
      props[normalizeAttribute(name)] = value
    }
    return props
  }
}

export default WidgetWebComponent