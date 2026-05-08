// Tauri IPC command surface. Each function is a thin adapter that delegates
// to a domain module (vault, parser, index). Keep this file free of business
// logic so the same modules remain unit-testable without Tauri runtime.

use crate::vault::{self, FileContent, FileNode, VaultMeta};

#[tauri::command]
pub fn open_vault(path: String) -> Result<VaultMeta, String> {
    vault::open_vault(&path)
}

#[tauri::command]
pub fn list_files(root: String) -> Result<Vec<FileNode>, String> {
    vault::list_files(&root)
}

#[tauri::command]
pub fn read_file(path: String) -> Result<FileContent, String> {
    vault::read_file(&path)
}
