# Streaming with FastAPI to React

This is an example implementation of streaming from a FastAPI backend to a React frontend.

## Some decisions
**Why use Tanstack Query?** Because when React is in strict mode it will send requests twice, and using Query is one way to prevent that. I'm also just familiar with the Query API & prefer it.

