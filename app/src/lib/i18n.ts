// i18n — EN / KO / JA. Notion-flavoured copy.

export type Lang = "en" | "ko" | "ja";

export interface Strings {
  app_name: string;
  quick_search: string;
  quick_ingest: string;
  quick_ask: string;
  nav_workspace: string;
  nav_pages: string;
  nav_tools: string;
  nav_overview: string;
  nav_ingest: string;
  nav_query: string;
  nav_graph: string;
  nav_history: string;
  nav_provenance: string;
  nav_settings: string;
  folder__root: string;
  folder_sources: string;
  folder_entities: string;
  folder_concepts: string;
  folder_techniques: string;
  folder_analyses: string;
  ph_search: string;
  ov_eyebrow: string;
  ov_title: string;
  ov_lede: string;
  ov_cta_ingest: string;
  ov_cta_ask: string;
  ov_stats_pages: string;
  ov_stats_sources: string;
  ov_stats_links: string;
  ov_stats_ratio: string;
  ov_recent: string;
  ov_recent_more: string;
  ov_quick: string;
  ing_title: string;
  ing_lede: string;
  ing_drop: string;
  ing_drop_or: string;
  ing_browse: string;
  ing_paste_url_ph: string;
  ing_or_paste: string;
  ing_paste_ph: string;
  ing_run: string;
  ing_recent: string;
  ing_pipeline: string;
  ing_step_read: string;
  ing_step_summarize: string;
  ing_step_extract: string;
  ing_step_link: string;
  ing_step_lint: string;
  ing_step_claude: string;
  ing_step_refresh: string;
  ing_success_title: string;
  ing_success_sub: string;
  ing_open_index: string;
  ing_open_report: string;
  ing_run_again: string;
  q_title: string;
  q_lede: string;
  q_ph: string;
  q_send: string;
  q_recent: string;
  q_answer: string;
  q_sources_used: string;
  q_wiki: string;
  q_raw: string;
  gr_title: string;
  gr_lede: string;
  gr_legend: string;
  gr_filter: string;
  gr_node_count: string;
  gr_edge_count: string;
  h_title: string;
  h_lede: string;
  h_view: string;
  h_revert: string;
  h_created: string;
  h_modified: string;
  p_title: string;
  p_lede: string;
  p_threshold: string;
  p_low: string;
  p_ok: string;
  s_title: string;
  s_account: string;
  s_workspace: string;
  s_model: string;
  s_providers: string;
  s_appearance: string;
  s_lang: string;
  s_about: string;
  s_model_lede: string;
  s_model_ingest: string;
  s_model_query: string;
  s_model_recommended: string;
  s_model_ctx: string;
  s_providers_lede: string;
  s_provider_connected: string;
  s_provider_disconnected: string;
  s_provider_connect: string;
  s_provider_disconnect: string;
  s_provider_test: string;
  s_lang_lede: string;
  s_lang_ui: string;
  s_lang_drafts: string;
  s_appearance_lede: string;
  s_appearance_light: string;
  s_appearance_dark: string;
  s_appearance_system: string;
  s_about_built: string;
}

export const STRINGS: Record<Lang, Strings> = {
  en: {
    app_name: "Memex",
    quick_search: "Search or jump to…",
    quick_ingest: "Ingest a source",
    quick_ask: "Ask the wiki",
    nav_workspace: "Workspace",
    nav_pages: "Pages",
    nav_tools: "Tools",
    nav_overview: "Overview",
    nav_ingest: "Ingest",
    nav_query: "Ask",
    nav_graph: "Graph",
    nav_history: "History",
    nav_provenance: "Provenance",
    nav_settings: "Settings",
    folder__root: "Root",
    folder_sources: "Sources",
    folder_entities: "Entities",
    folder_concepts: "Concepts",
    folder_techniques: "Techniques",
    folder_analyses: "Analyses",
    ph_search: "Search or jump to…",
    ov_eyebrow: "Living wiki",
    ov_title: "Drop a source. Watch the graph grow.",
    ov_lede:
      "Memex turns every paper, article and note you ingest into a cross-linked, fully-cited knowledge graph — kept in plain markdown so you stay in control.",
    ov_cta_ingest: "Ingest a source",
    ov_cta_ask: "Ask the wiki",
    ov_stats_pages: "Pages",
    ov_stats_sources: "Sources",
    ov_stats_links: "Links",
    ov_stats_ratio: "Wiki-only answers",
    ov_recent: "Recent activity",
    ov_recent_more: "View all",
    ov_quick: "Jump back in",
    ing_title: "Ingest",
    ing_lede:
      "Drop a file, paste a URL, or write a note. Memex will route it through Claude, extract entities and concepts, write a source page, and weave it into the graph.",
    ing_drop: "Drop a file here",
    ing_drop_or: "or paste a URL",
    ing_browse: "Browse files…",
    ing_paste_url_ph: "https://example.com/paper.pdf",
    ing_or_paste: "Or paste raw text",
    ing_paste_ph: "Paste an article, transcript, your own notes…",
    ing_run: "Ingest with Claude",
    ing_recent: "Recent ingests",
    ing_pipeline: "Pipeline",
    ing_step_read: "Read source",
    ing_step_summarize: "Summarise",
    ing_step_extract: "Extract entities & concepts",
    ing_step_link: "Cross-link existing pages",
    ing_step_lint: "Lint and write log",
    ing_step_claude: "Claude reads & writes wiki",
    ing_step_refresh: "Refresh index & link graph",
    ing_success_title: "Ingest complete",
    ing_success_sub: "Wiki updated · {time}",
    ing_open_index: "Open wiki index",
    ing_open_report: "Open ingest report",
    ing_run_again: "Ingest another",
    q_title: "Ask the wiki",
    q_lede:
      "Memex answers from your wiki first, then reaches into raw sources only when needed. Every claim ships with a citation.",
    q_ph: "What is BPE? How does midtraining differ from finetuning?",
    q_send: "Ask",
    q_recent: "Recent questions",
    q_answer: "Answer",
    q_sources_used: "Sources used",
    q_wiki: "wiki",
    q_raw: "raw",
    gr_title: "Graph",
    gr_lede:
      "Pages and the links between them. Drag to pan, scroll to zoom, click a node to focus.",
    gr_legend: "Legend",
    gr_filter: "Filter",
    gr_node_count: "nodes",
    gr_edge_count: "links",
    h_title: "History",
    h_lede:
      "Every ingest is a git commit. Inspect what changed, diff pages against earlier versions, or roll back.",
    h_view: "View diff",
    h_revert: "Revert",
    h_created: "created",
    h_modified: "modified",
    p_title: "Provenance",
    p_lede:
      "Each wiki claim carries a citation back to the raw source. Pages with low coverage are flagged so you can fix or remove them.",
    p_threshold: "Coverage threshold",
    p_low: "Below threshold",
    p_ok: "Healthy",
    s_title: "Settings",
    s_account: "Account",
    s_workspace: "Workspace",
    s_model: "Model",
    s_providers: "Connections",
    s_appearance: "Appearance",
    s_lang: "Language",
    s_about: "About",
    s_model_lede:
      "Memex uses Claude by default. You can switch models for ingest, queries, or both — each task can use a different model.",
    s_model_ingest: "Ingest model",
    s_model_query: "Query model",
    s_model_recommended: "Recommended",
    s_model_ctx: "context",
    s_providers_lede:
      "Bring your own provider. Memex never sees your keys — they're stored locally.",
    s_provider_connected: "Connected",
    s_provider_disconnected: "Not connected",
    s_provider_connect: "Connect",
    s_provider_disconnect: "Disconnect",
    s_provider_test: "Test",
    s_lang_lede:
      "Memex's UI and Claude's drafting language are independent — write English notes from a Korean UI if you like.",
    s_lang_ui: "Interface",
    s_lang_drafts: "Drafting language (Claude)",
    s_appearance_lede: "Theme follows your system by default.",
    s_appearance_light: "Light",
    s_appearance_dark: "Dark",
    s_appearance_system: "System",
    s_about_built:
      "Memex is a thin client over a local Obsidian vault and the Claude Code CLI. Pages are plain markdown — your knowledge stays yours.",
  },
  ko: {
    app_name: "Memex",
    quick_search: "검색하거나 이동…",
    quick_ingest: "소스 가져오기",
    quick_ask: "위키에 질문하기",
    nav_workspace: "워크스페이스",
    nav_pages: "페이지",
    nav_tools: "도구",
    nav_overview: "개요",
    nav_ingest: "가져오기",
    nav_query: "질문",
    nav_graph: "그래프",
    nav_history: "히스토리",
    nav_provenance: "출처",
    nav_settings: "설정",
    folder__root: "루트",
    folder_sources: "소스",
    folder_entities: "엔티티",
    folder_concepts: "개념",
    folder_techniques: "기법",
    folder_analyses: "분석",
    ph_search: "검색하거나 이동…",
    ov_eyebrow: "살아있는 위키",
    ov_title: "소스를 넣으면, 그래프가 자랍니다.",
    ov_lede:
      "Memex는 가져온 모든 논문·아티클·노트를 인용 기반으로 연결된 지식 그래프로 만듭니다. 모든 페이지는 마크다운이라, 통제권은 항상 당신에게 있습니다.",
    ov_cta_ingest: "소스 가져오기",
    ov_cta_ask: "위키에 질문",
    ov_stats_pages: "페이지",
    ov_stats_sources: "소스",
    ov_stats_links: "연결",
    ov_stats_ratio: "위키만으로 답변",
    ov_recent: "최근 활동",
    ov_recent_more: "전체 보기",
    ov_quick: "이어서 보기",
    ing_title: "가져오기",
    ing_lede:
      "파일을 드롭하거나 URL을 붙여넣거나 메모를 입력하세요. Claude가 읽고, 엔티티와 개념을 추출하고, 소스 페이지를 만들고, 그래프에 엮어 넣습니다.",
    ing_drop: "여기에 파일 드롭",
    ing_drop_or: "또는 URL 붙여넣기",
    ing_browse: "파일 선택…",
    ing_paste_url_ph: "https://example.com/paper.pdf",
    ing_or_paste: "또는 원문 붙여넣기",
    ing_paste_ph: "아티클·트랜스크립트·메모를 붙여 넣으세요…",
    ing_run: "Claude로 가져오기",
    ing_recent: "최근 가져온 항목",
    ing_pipeline: "파이프라인",
    ing_step_read: "소스 읽기",
    ing_step_summarize: "요약",
    ing_step_extract: "엔티티·개념 추출",
    ing_step_link: "기존 페이지와 교차 연결",
    ing_step_lint: "린트 및 로그 기록",
    ing_step_claude: "Claude가 위키를 작성",
    ing_step_refresh: "인덱스·그래프 갱신",
    ing_success_title: "가져오기 완료",
    ing_success_sub: "위키가 갱신되었습니다 · {time}",
    ing_open_index: "위키 인덱스 열기",
    ing_open_report: "Ingest 보고서 열기",
    ing_run_again: "새로 가져오기",
    q_title: "위키에 질문하기",
    q_lede:
      "Memex는 먼저 위키에서 답을 찾고, 부족할 때만 원본 소스로 들어갑니다. 모든 주장에는 인용이 따라옵니다.",
    q_ph: "BPE는 무엇인가요? 미드트레이닝은 파인튜닝과 어떻게 다른가요?",
    q_send: "질문하기",
    q_recent: "최근 질문",
    q_answer: "답변",
    q_sources_used: "참조된 소스",
    q_wiki: "위키",
    q_raw: "원본",
    gr_title: "그래프",
    gr_lede:
      "페이지와 그 사이의 연결. 드래그로 이동, 스크롤로 줌, 노드 클릭으로 포커스.",
    gr_legend: "범례",
    gr_filter: "필터",
    gr_node_count: "노드",
    gr_edge_count: "연결",
    h_title: "히스토리",
    h_lede:
      "모든 가져오기는 git 커밋입니다. 변경 내역을 보고, 이전 버전과 비교하고, 되돌릴 수 있습니다.",
    h_view: "diff 보기",
    h_revert: "되돌리기",
    h_created: "생성",
    h_modified: "수정",
    p_title: "출처",
    p_lede:
      "위키의 각 주장은 원본 소스로 인용됩니다. 인용 비율이 낮은 페이지는 표시되어 수정하거나 제거할 수 있습니다.",
    p_threshold: "인용률 임계값",
    p_low: "임계값 미만",
    p_ok: "양호",
    s_title: "설정",
    s_account: "계정",
    s_workspace: "워크스페이스",
    s_model: "모델",
    s_providers: "연결",
    s_appearance: "테마",
    s_lang: "언어",
    s_about: "정보",
    s_model_lede:
      "Memex는 기본적으로 Claude를 사용합니다. 가져오기와 질문에 서로 다른 모델을 지정할 수 있습니다.",
    s_model_ingest: "가져오기용 모델",
    s_model_query: "질문용 모델",
    s_model_recommended: "추천",
    s_model_ctx: "컨텍스트",
    s_providers_lede:
      "원하는 제공자를 연결하세요. 키는 로컬에만 저장되며, Memex 서버는 절대 보지 못합니다.",
    s_provider_connected: "연결됨",
    s_provider_disconnected: "미연결",
    s_provider_connect: "연결",
    s_provider_disconnect: "해제",
    s_provider_test: "테스트",
    s_lang_lede:
      "UI 언어와 Claude의 작성 언어는 별개입니다. 한국어 UI에서 영어 노트를 만들어도 좋습니다.",
    s_lang_ui: "인터페이스",
    s_lang_drafts: "작성 언어 (Claude)",
    s_appearance_lede: "기본값은 시스템을 따릅니다.",
    s_appearance_light: "라이트",
    s_appearance_dark: "다크",
    s_appearance_system: "시스템",
    s_about_built:
      "Memex는 로컬 Obsidian 볼트와 Claude Code CLI 위에서 동작하는 얇은 클라이언트입니다. 페이지는 마크다운 — 당신의 지식은 당신의 것입니다.",
  },
  ja: {
    app_name: "Memex",
    quick_search: "検索 / 移動…",
    quick_ingest: "ソースを取り込む",
    quick_ask: "ウィキに質問",
    nav_workspace: "ワークスペース",
    nav_pages: "ページ",
    nav_tools: "ツール",
    nav_overview: "概要",
    nav_ingest: "取り込み",
    nav_query: "質問",
    nav_graph: "グラフ",
    nav_history: "履歴",
    nav_provenance: "出典",
    nav_settings: "設定",
    folder__root: "ルート",
    folder_sources: "ソース",
    folder_entities: "エンティティ",
    folder_concepts: "概念",
    folder_techniques: "技法",
    folder_analyses: "分析",
    ph_search: "検索 / 移動…",
    ov_eyebrow: "生きたウィキ",
    ov_title: "ソースを入れる。グラフが育つ。",
    ov_lede:
      "Memex は取り込んだ論文・記事・ノートを、引用付きの知識グラフへと織り上げます。すべてはマークダウン — あなたの知識は、あなたの手の中に。",
    ov_cta_ingest: "ソースを取り込む",
    ov_cta_ask: "ウィキに質問",
    ov_stats_pages: "ページ",
    ov_stats_sources: "ソース",
    ov_stats_links: "リンク",
    ov_stats_ratio: "ウィキだけで回答",
    ov_recent: "最近のアクティビティ",
    ov_recent_more: "すべて見る",
    ov_quick: "続きから",
    ing_title: "取り込み",
    ing_lede:
      "ファイルをドロップ、URL を貼り付け、あるいはメモを書く。Claude が読み、エンティティと概念を抽出し、ソースページを作成し、グラフに織り込みます。",
    ing_drop: "ここにファイルをドロップ",
    ing_drop_or: "または URL を貼り付け",
    ing_browse: "ファイルを選択…",
    ing_paste_url_ph: "https://example.com/paper.pdf",
    ing_or_paste: "原文を貼り付け",
    ing_paste_ph: "記事・トランスクリプト・メモを貼り付けてください…",
    ing_run: "Claude で取り込む",
    ing_recent: "最近の取り込み",
    ing_pipeline: "パイプライン",
    ing_step_read: "ソースを読む",
    ing_step_summarize: "要約",
    ing_step_extract: "エンティティ・概念を抽出",
    ing_step_link: "既存ページと相互リンク",
    ing_step_lint: "リント & ログ書き込み",
    ing_step_claude: "Claude がウィキを書く",
    ing_step_refresh: "インデックス・グラフ更新",
    ing_success_title: "取り込み完了",
    ing_success_sub: "ウィキを更新しました · {time}",
    ing_open_index: "ウィキインデックスを開く",
    ing_open_report: "取り込みレポートを開く",
    ing_run_again: "別のソースを取り込む",
    q_title: "ウィキに質問",
    q_lede:
      "Memex はまずウィキから答え、必要なときだけ原本に降りていきます。すべての主張に出典が付きます。",
    q_ph: "BPE とは? ミッドトレーニングはファインチューニングとどう違う?",
    q_send: "質問する",
    q_recent: "最近の質問",
    q_answer: "回答",
    q_sources_used: "参照したソース",
    q_wiki: "ウィキ",
    q_raw: "原本",
    gr_title: "グラフ",
    gr_lede:
      "ページとリンク。ドラッグでパン、スクロールでズーム、ノードをクリックでフォーカス。",
    gr_legend: "凡例",
    gr_filter: "フィルター",
    gr_node_count: "ノード",
    gr_edge_count: "リンク",
    h_title: "履歴",
    h_lede:
      "すべての取り込みは git コミット。差分を見たり、過去のバージョンと比較したり、戻したりできます。",
    h_view: "diff を見る",
    h_revert: "戻す",
    h_created: "作成",
    h_modified: "変更",
    p_title: "出典",
    p_lede:
      "ウィキの各主張は原本に紐づきます。引用率の低いページにはフラグが立ち、修正や削除を促します。",
    p_threshold: "引用率しきい値",
    p_low: "しきい値未満",
    p_ok: "良好",
    s_title: "設定",
    s_account: "アカウント",
    s_workspace: "ワークスペース",
    s_model: "モデル",
    s_providers: "接続",
    s_appearance: "外観",
    s_lang: "言語",
    s_about: "Memex について",
    s_model_lede:
      "Memex は標準で Claude を使います。取り込みと質問で別々のモデルを指定できます。",
    s_model_ingest: "取り込み用モデル",
    s_model_query: "質問用モデル",
    s_model_recommended: "推奨",
    s_model_ctx: "コンテキスト",
    s_providers_lede:
      "好きなプロバイダーを接続してください。キーはローカル保存 — Memex のサーバーには届きません。",
    s_provider_connected: "接続済み",
    s_provider_disconnected: "未接続",
    s_provider_connect: "接続",
    s_provider_disconnect: "解除",
    s_provider_test: "テスト",
    s_lang_lede:
      "UI 言語と Claude の作成言語は独立。日本語 UI から英語のノートを書いても OK です。",
    s_lang_ui: "インターフェース",
    s_lang_drafts: "作成言語 (Claude)",
    s_appearance_lede: "既定はシステム設定に従います。",
    s_appearance_light: "ライト",
    s_appearance_dark: "ダーク",
    s_appearance_system: "システム",
    s_about_built:
      "Memex はローカルの Obsidian ボルトと Claude Code CLI 上に立つ薄いクライアントです。ページはマークダウン — あなたの知識はあなたのもの。",
  },
};
