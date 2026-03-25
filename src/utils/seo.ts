// Helper để cập nhật thẻ Meta động cho SEO
export const updateMetaTag = (name: string, content: string, attribute: string = 'name'): void => {
  let element = document.querySelector(`meta[${attribute}="${name}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};
