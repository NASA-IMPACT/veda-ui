// Add images to a React project with Typescript
// From: https://dev.to/minompi/add-images-to-a-react-project-with-typescript-4gbm
declare module "*.jpg" {
  const path: string;
  export default path;
}

declare module "*.png" {
  const path: string;
  export default path;
}

declare module "*.gif" {
  const path: string;
  export default path;
}
