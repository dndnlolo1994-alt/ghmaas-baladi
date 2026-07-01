import json

log_path = r"C:\Users\m4ah4\.gemini\antigravity\brain\5dda66b6-9e70-41df-9823-7bd65fa8e4a0\.system_generated\logs\transcript_full.jsonl"
steps_to_print = [93, 647, 854, 1052, 1086]

with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
            if data.get('step_index') in steps_to_print:
                print(f"--- STEP {data.get('step_index')} ({data.get('type')}) ---")
                print(data.get('content'))
        except Exception as e:
            pass
