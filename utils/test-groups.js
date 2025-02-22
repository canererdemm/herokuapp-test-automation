// Test case'leri grupla
function groupTestsByFolder(testCases) {
    const groups = {};
    
    testCases.forEach(test => {
        if (!test.folder) return;
        
        // Klasör yolunu parçala ve son klasörü al
        const folders = test.folder.split('/').filter(f => f && f !== 'Root');
        const mainFolder = folders[0];
        
        // Valid/Invalid Cases'i ana klasöre ekle
        const fullFolderName = folders.join(' - ');
        
        if (!groups[fullFolderName]) {
            groups[fullFolderName] = [];
        }
        groups[fullFolderName].push(test);
    });
    
    return groups;
}

module.exports = { groupTestsByFolder }; 