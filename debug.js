// 调试脚本 - 检查所有功能
console.log('开始调试...');

// 检查脚本数据
console.log('检查脚本数据...');
if (typeof scriptsData !== 'undefined') {
    console.log('✓ scriptsData 已加载，包含', scriptsData.length, '个脚本');
    
    // 检查每个脚本的完整性
    scriptsData.forEach((script, index) => {
        const requiredFields = ['id', 'title', 'category', 'description', 'code'];
        const missing = requiredFields.filter(field => !script[field]);
        if (missing.length > 0) {
            console.error('✗ 脚本', index + 1, '缺少字段:', missing);
        } else {
            console.log('✓ 脚本', index + 1, '数据完整');
        }
    });
} else {
    console.error('✗ scriptsData 未定义');
}

// 检查关键函数
console.log('检查关键函数...');
const functions = ['initializeApp', 'copyScript', 'showToast', 'loadScripts', 'createScriptCard'];
functions.forEach(funcName => {
    if (typeof window[funcName] === 'function') {
        console.log('✓', funcName, '函数存在');
    } else {
        console.error('✗', funcName, '函数不存在');
    }
});

// 检查DOM元素
console.log('检查DOM元素...');
const elements = ['scriptsGrid', 'searchInput', 'toast'];
elements.forEach(elementId => {
    const element = document.getElementById(elementId);
    if (element) {
        console.log('✓', elementId, '元素存在');
    } else {
        console.error('✗', elementId, '元素不存在');
    }
});

// 测试复制功能
console.log('测试复制功能...');
if (typeof copyScript === 'function' && scriptsData && scriptsData.length > 0) {
    try {
        copyScript(scriptsData[0].id);
        console.log('✓ 复制功能测试完成');
    } catch (error) {
        console.error('✗ 复制功能测试失败:', error);
    }
}

console.log('调试完成');
