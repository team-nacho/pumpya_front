export const withLogging = ({ msg, type }: { msg: string; type: string }) => {
  if (process.env.NODE_ENV !== 'production') {
    switch (type) {
      case 'error':
        console.error(msg);
        break;
      case 'info':
        console.info(msg);
        break;
      case 'log':
        console.log(msg);
        break;
      default:
        console.log(msg);
    }
  }
}