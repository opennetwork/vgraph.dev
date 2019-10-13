declare namespace JSX {

  type BooleanAttribute = "true" | "false" | "";

  // TODO
  interface HTMLAriaAttributes {
    role?: string;
  }

  interface HTMLElementAttributes extends HTMLAriaAttributes {
    [key: string]: string | Function;
    class?: string;
    accesskey?: string;
    contenteditable?: BooleanAttribute;
    contextmenu?: string;
    dir?: "rtl" | "ltr" | "auto";
    draggable?: string;
    dropzone?: string;
    hidden?: string;
    id?: string;
    itemprop?: string;
    lang?: string;
    slot?: string;
    spellcheck?: string;
    style?: string;
    tabindex?: string;
    title?: string;
    translate?: string;

    onBeforeRender?: (element: Element) => void | Promise<void>;
    getDocumentNode?: () => Element | Promise<Element>;
  }

  interface HTMLButtonAttributes extends HTMLElementAttributes {
    type?: "submit" | "button";
  }

  interface HTMLAnchorAttributes extends HTMLElementAttributes {
    href?: string;
    download?: string;
    hreflang?: string;
    ping?: string;
    referrerpolicy?: ReferrerPolicy;
    rel?: string;
    target?: "_self" | "_blank" | "_parent" | "_top" | string;
    type?: string;
  }

  interface HTMLImageAttributes extends HTMLElementAttributes {
    src?: string;
    alt?: string;
    srcset?: string;
  }

  interface HTMLLinkAttributes extends HTMLElementAttributes {
    rel?: string;
    href?: string;
    as?: "audio" | "document" | "embed" | "fetch" | "font" | "image" | "object" | "script" | "style" | "track" | "video" | "worker";
    crossorigin?: "anonymous" | "use-credentials";
    disabled?: BooleanAttribute;
    hreflang?: string;
    importance?: "auto" | "high" | "low";
    integrity?: string;
    media?: string;
    referrerpolicy?: ReferrerPolicy;
    sizes?: string;
    title?: string;
    type?: string;
    prefetch?: string;
  }

  interface HTMLMetaAttributes extends HTMLElementAttributes {
    charset?: string;
    content?: string;
    "http-equiv"?: "content-security-policy" | "refresh";
    name?: "application-name" | "author" | "description" | "generator"  | "keywords" | "referrer" | "theme-color" | "color-scheme" | "creator" | "googlebot" | "publisher" | "robots" | "slurp" | "viewport";
    value?: string;
  }

  interface HTMLSlotAttributes extends HTMLElementAttributes {
    name?: string;
  }

  interface HTMLScriptAttributes extends HTMLElementAttributes {
    src?: string;
    type?: string;
    async?: BooleanAttribute;
    crossorigin?: string;
    defer?: BooleanAttribute;
    integrity?: string;
    nomodule?: string;
    nonce?: string;
    referrerpolicy?: ReferrerPolicy;
  }

  // interface DOMElements {
  //   "dom-html": HTMLElementAttributes;
  //   "dom-body": HTMLElementAttributes;
  //   "dom-head": HTMLElementAttributes;
  //   "dom-title": HTMLElementAttributes;
  //   "dom-header": HTMLElementAttributes;
  //   "dom-footer": HTMLElementAttributes;
  //   "dom-article": HTMLElementAttributes;
  //   "dom-section": HTMLElementAttributes;
  //   "dom-div": HTMLElementAttributes;
  //   "dom-span": HTMLElementAttributes;
  //   "dom-img": HTMLImageAttributes;
  //   "dom-aside": HTMLElementAttributes;
  //   "dom-audio": HTMLElementAttributes;
  //   "dom-canvas": HTMLElementAttributes;
  //   "dom-datalist": HTMLElementAttributes;
  //   "dom-details": HTMLElementAttributes;
  //   "dom-embed": HTMLElementAttributes;
  //   "dom-nav": HTMLElementAttributes;
  //   "dom-output": HTMLElementAttributes;
  //   "dom-progress": HTMLElementAttributes;
  //   "dom-video": HTMLElementAttributes;
  //   "dom-ul": HTMLElementAttributes;
  //   "dom-li": HTMLElementAttributes;
  //   "dom-ol": HTMLElementAttributes;
  //   "dom-a": HTMLAnchorAttributes;
  //   "dom-p": HTMLElementAttributes;
  //   "dom-button": HTMLButtonAttributes;
  //   "dom-table": HTMLElementAttributes;
  //   "dom-thead": HTMLElementAttributes;
  //   "dom-tbody": HTMLElementAttributes;
  //   "dom-tr": HTMLElementAttributes;
  //   "dom-td": HTMLElementAttributes;
  //   "dom-th": HTMLElementAttributes;
  //   "dom-link": HTMLLinkAttributes;
  //   "dom-meta": HTMLMetaAttributes;
  //   "dom-marquee": HTMLElementAttributes;
  //   "dom-slot": HTMLSlotAttributes;
  //   "dom-h1": HTMLElementAttributes;
  //   "dom-h2": HTMLElementAttributes;
  //   "dom-h3": HTMLElementAttributes;
  //   "dom-h4": HTMLElementAttributes;
  //   "dom-h5": HTMLElementAttributes;
  //   "dom-h6": HTMLElementAttributes;
  // }

  interface DOMElements {
    html: HTMLElementAttributes;
    body: HTMLElementAttributes;
    head: HTMLElementAttributes;
    title: HTMLElementAttributes;
    header: HTMLElementAttributes;
    footer: HTMLElementAttributes;
    article: HTMLElementAttributes;
    section: HTMLElementAttributes;
    div: HTMLElementAttributes;
    span: HTMLElementAttributes;
    img: HTMLImageAttributes;
    aside: HTMLElementAttributes;
    audio: HTMLElementAttributes;
    canvas: HTMLElementAttributes;
    datalist: HTMLElementAttributes;
    details: HTMLElementAttributes;
    embed: HTMLElementAttributes;
    nav: HTMLElementAttributes;
    output: HTMLElementAttributes;
    progress: HTMLElementAttributes;
    video: HTMLElementAttributes;
    ul: HTMLElementAttributes;
    li: HTMLElementAttributes;
    ol: HTMLElementAttributes;
    a: HTMLAnchorAttributes;
    p: HTMLElementAttributes;
    button: HTMLButtonAttributes;
    table: HTMLElementAttributes;
    thead: HTMLElementAttributes;
    tbody: HTMLElementAttributes;
    tr: HTMLElementAttributes;
    td: HTMLElementAttributes;
    th: HTMLElementAttributes;
    link: HTMLLinkAttributes;
    meta: HTMLMetaAttributes;
    marquee: HTMLElementAttributes;
    slot: HTMLSlotAttributes;
    h1: HTMLElementAttributes;
    h2: HTMLElementAttributes;
    h3: HTMLElementAttributes;
    h4: HTMLElementAttributes;
    h5: HTMLElementAttributes;
    h6: HTMLElementAttributes;
    script: HTMLScriptAttributes;
  }

  interface IntrinsicElements extends DOMElements {
    fragment: {};
  }

}
