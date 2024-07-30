import { ResourcePath } from '../../../types/resources';

const getUniquePaths = (paths: ResourcePath[], items: ResourcePath[]): ResourcePath[] => {
  const content: ResourcePath[] = [...paths];
  items.forEach((element: ResourcePath) => {
    const exists = !!content.find(k => k.key === element.key);
    if (!exists) {
      content.push(element);
    }
  });
  return content;
}

export {
  getUniquePaths
};
