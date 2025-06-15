const fs = require('fs-extra');
const path = require('path');

// コピー元とコピー先のディレクトリを定義
const srcDir = __dirname;
const distDir = path.join(__dirname, 'dist');

// コピーするファイルとディレクトリのリスト
const filesToCopy = [
    'index.html',
    'styles',
    'components',
    'utils'
];

// dist ディレクトリが存在しない場合は作成
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// ファイルとディレクトリをコピーする関数
async function copyFiles() {
    try {
        // 各ファイル/ディレクトリをコピー
        for (const file of filesToCopy) {
            const srcPath = path.join(srcDir, file);
            const destPath = path.join(distDir, file);
            
            console.log(`Copying ${srcPath} to ${destPath}`);
            await fs.copy(srcPath, destPath);
        }

        // app.js を dist ディレクトリのルートにコピー
        await fs.copyFile(
            path.join(srcDir, 'js', 'app.js'),
            path.join(distDir, 'app.js')
        );

        // app.js の相対パスを修正
        const appJsPath = path.join(distDir, 'app.js');
        let appJsContent = await fs.readFile(appJsPath, 'utf8');
        
        // 相対パスを修正
        appJsContent = appJsContent
            .replace("from '../utils/StorageManager.js'", "from './utils/StorageManager.js'")
            .replace("from '../components/DumpList.js'", "from './components/DumpList.js'")
            .replace("from '../components/TodoList.js'", "from './components/TodoList.js'")
            .replace("from '../components/CompletedList.js'", "from './components/CompletedList.js'")
            .replace("from '../components/TabManager.js'", "from './components/TabManager.js'");
        
        await fs.writeFile(appJsPath, appJsContent, 'utf8');
        
        console.log('Build completed successfully!');
    } catch (err) {
        console.error('Error during build:', err);
        process.exit(1);
    }
}

// ビルドを実行
copyFiles();
