import qt from '@nodegui/nodegui';

const win = new qt.QMainWindow();
const [width, height] = [1000, 500];
win.setMinimumSize(width, height);
win.setMaximumSize(width, height);
win.setWindowTitle('Main Brain');
win.show();

global.win = win; 