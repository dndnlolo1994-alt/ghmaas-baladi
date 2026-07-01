import json

log_path = r"C:\Users\m4ah4\.gemini\antigravity\brain\5dda66b6-9e70-41df-9823-7bd65fa8e4a0\.system_generated\logs\transcript_full.jsonl"

search_terms = ["احمر", "أحمر", "شيل", "اللون", "الاحمر", "الأحمر"]

with open(log_path, 'r', encoding='utf-8') as f:
    for i, line in enumerate(f):
        if any(term in line for term in search_terms):
            try:
                data = json.loads(line)
                print(f"Step {data.get('step_index')}, Keys: {list(data.keys())}")
                if 'content' in data:
                    print(f"  Content type: {type(data['content'])}")
                    if isinstance(data['content'], str):
                        print(f"  Content snippet: {data['content'][:150]}")
            except Exception as e:
                pass
