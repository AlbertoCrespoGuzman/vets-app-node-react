module.exports = {
  apps : [
    {
      name      : "frontend-react",
      script    : "npx",
      interpreter: "none",
      args: "serve  -s build -l 3000" 
    }
  ]
}