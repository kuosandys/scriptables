export function createErrorWidget(message: string) {
  const widget = new ListWidget();
  widget.addText(`Error: ${message}`);

  return widget;
}
