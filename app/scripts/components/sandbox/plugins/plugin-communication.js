export class PluginCommunication {
  constructor(pluginName, onMessage) {
    this.pluginName = pluginName;
    this.onMessage = onMessage;
    this.handleMessage = this.handleMessage.bind(this);
  }

  init() {
    window.addEventListener('message', this.handleMessage);
  }

  destroy() {
    window.removeEventListener('message', this.handleMessage);
  }

  updateOnMessage(onMessage) {
    this.onMessage = onMessage;
  }

  handleMessage(event) {
    if (event.source !== window.parent) return;
    const data = event.data;
    if (data?.plugin !== this.pluginName) return;
    this.onMessage?.(data.payload);
  }

  send(payload) {
    window.parent.postMessage({ plugin: this.pluginName, payload }, '*');
  }
}
