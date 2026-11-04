// CA_Status - one line of status for the whole view, as a small bar at the bottom of the window.
// A process talks to it with callMethod:
//   <operation name="callMethod" value="#App#status">
//     <method name="notify"><param type="string">Saved.</param><param type="string">ok</param></method>
//   </operation>
// Kinds: info (default), ok, error, busy. info and ok go away after four seconds; error and busy stay
// until clear() or the reader dismisses them (the Dismiss event). busy shows a spinner.
// getValue() is the text showing now, "" when nothing is.
//
// External component (ES module): declared in the manifest as
//   <component name="Status" tag="status" class="CA_Status" href="ui/DesignKit/CA_Status.js" container="false">
//     <skin href="ui/DesignKit/status.xsl"/>
//   </component>
// and placed last in the view's root panel: <status name="status"/>. Its CSS is designkit.css.
// ASCII only: a webshare labels .js files ISO-8859-1.

const KINDS = ['info', 'ok', 'error', 'busy'];
const HIDE_AFTER = { info: 4000, ok: 4000 };

export class CA_Status extends Component {
  constructor() {
    super();
    this.onClose = this.onClose.bind(this);
    this.timer = 0;
    this.text = '';
    this.kind = '';
  }

  init() {
    this.dom = this.getElement();
    this.label = this.getChildElement('Text');
    this.closeBtn = this.getChildElement('Close');
    if (this.closeBtn) this.attachEvent(this.closeBtn, 'click', this.onClose);
    this.clear();
  }

  notify(text, kind) {
    const k = KINDS.indexOf(kind) > -1 ? kind : 'info';
    const win = (this.doc && this.doc.defaultView) || window;
    win.clearTimeout(this.timer);
    this.text = text == null ? '' : String(text);
    this.kind = k;
    if (this.label) this.label.textContent = this.text;
    KINDS.forEach((n) => this.dom.classList.remove('xios-status_' + n));
    this.dom.classList.add('xios-status_' + k);
    this.dom.style.display = this.text ? 'flex' : 'none';
    // no setProperty('value') here: the runtime answers setProperty by calling setValue, which would notify again
    if (HIDE_AFTER[k]) this.timer = win.setTimeout(() => this.clear(), HIDE_AFTER[k]);
    return this.text;
  }

  busy(text) { return this.notify(text || 'Working...', 'busy'); }
  ok(text) { return this.notify(text, 'ok'); }
  error(text) { return this.notify(text, 'error'); }

  clear() {
    const win = (this.doc && this.doc.defaultView) || window;
    win.clearTimeout(this.timer);
    this.text = '';
    this.kind = '';
    if (this.label) this.label.textContent = '';
    if (this.dom) this.dom.style.display = 'none';
    return '';
  }

  getValue() { return this.text; }
  setValue(v) { if (String(v == null ? '' : v) !== this.text) this.notify(v, 'info'); }

  onClose(winEvt) {
    this.clear();
    sys.evtMng.notifyListeners(this, 'Dismiss', winEvt, null);
  }
}
