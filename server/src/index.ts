import app from './app';
declare const process: any;
const port = Number(process.env.PORT) || 5174;
app.listen(port, () => console.log(`API running on http://localhost:${port}`));
