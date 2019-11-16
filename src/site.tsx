import { h } from "./h";
import { VNode } from "@opennetwork/vnode";
import { SiteContents } from "./contents";
import { PRIMARY_SCRIPT_SOURCE } from "./environment";

export function SiteHead(): VNode {
  return (
    <fragment>
      <title>VGraph</title>
      <link href="index.css" rel="stylesheet" type="text/css" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </fragment>
  );
}

export function SiteBody(): VNode {
 return (
   <fragment>
     <SiteContents />
     <script src={PRIMARY_SCRIPT_SOURCE} onBeforeRender={console.log} type="module" />
     <script nomodule="" type="application/javascript">
        const warningMessage = document.createElement("div");
        warningMessage.setAttribute("role", "alert");
        warningMessage.setAttribute("aria-live", "assertive");
        warningMessage.className = "esm-warning";
        warningMessage.textContent = "This website uses a new JavaScript module standard which your browser does not support, some content may not be responsive on this page.";
        document.body.insertBefore(warningMessage, document.body.firstChild);
     </script>
   </fragment>
 );
}
