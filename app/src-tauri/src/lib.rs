// Memex application entry point. The Tauri builder is intentionally minimal at
// scaffold stage; subsequent steps wire vault, parser and index modules into
// the IPC surface.

pub fn run() {
    tauri::Builder::default()
        .setup(|_app| Ok(()))
        .run(tauri::generate_context!())
        .expect("error while running Memex");
}
