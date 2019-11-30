export function isChrome(): boolean {
  // See https://stackoverflow.com/a/13348618/1174869
  //
  // please note,
  // that IE11 now returns undefined again for window.chrome
  // and new Opera 30 outputs true for window.chrome
  // but needs to check if window.opr is not undefined
  // and new IE Edge outputs to true now for window.chrome
  // and if not iOS Chrome check
  // so use the below updated condition
  const windowAny: any = window;
  const isChromium = windowAny.chrome;
  const winNav = windowAny.navigator;
  const vendorName = winNav.vendor;
  const isOpera = typeof windowAny.opr !== "undefined";
  const isIEedge = winNav.userAgent.indexOf("Edge") > -1;
  const isIOSChrome = winNav.userAgent.match("CriOS");

  return !!(
    !isIOSChrome &&
    isChromium !== null &&
    typeof isChromium !== "undefined" &&
    vendorName === "Google Inc." &&
    isOpera === false &&
    isIEedge === false
  );
}
