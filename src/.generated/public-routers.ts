export const publicRouters = [
  {
    "module": "ExampleModule",
    "path": "/example",
    "entry": "modules/ExampleModule/frontend/page"
  },
  {
    "module": "FrontendModule",
    "path": "/",
    "entry": "modules/frontend/frontend/page"
  },
  {
    "module": "Profile",
    "path": "/:username",
    "entry": "modules/profile/frontend/page"
  }
];
