"""
Illustrative QLoRA fine-tuning loop.
This shows the moving parts by hand — in the real project you'd likely
hand most of this to Axolotl or Unsloth instead (see chat for why).
"""

from datasets import load_dataset
from transformers import (
    AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig,
    TrainingArguments, Trainer, DataCollatorForLanguageModeling,
)
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training
import torch

MODEL_NAME = "meta-llama/Llama-3.1-8B"  # example base model

# ---- 1. Load and format your dataset ----
# Expects examples like {"text": "<prompt><response>"} after templating
dataset = load_dataset("json", data_files="train.jsonl")["train"]

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
tokenizer.pad_token = tokenizer.eos_token

def tokenize(example):
    return tokenizer(example["text"], truncation=True, max_length=1024)

dataset = dataset.map(tokenize, remove_columns=dataset.column_names)

# ---- 2. Load the base model in 4-bit (this is the "Q" in QLoRA) ----
bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.bfloat16,
    bnb_4bit_use_double_quant=True,
)

model = AutoModelForCausalLM.from_pretrained(
    MODEL_NAME,
    quantization_config=bnb_config,
    device_map="auto",
)
model = prepare_model_for_kbit_training(model)  # stabilizes 4-bit training

# ---- 3. Attach LoRA adapters (only these get trained) ----
lora_config = LoraConfig(
    r=16,                    # rank of the adapter matrices
    lora_alpha=32,           # scaling factor
    target_modules=["q_proj", "v_proj"],  # which layers get adapters
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM",
)
model = get_peft_model(model, lora_config)
model.print_trainable_parameters()  # sanity check: should be <1% of total

# ---- 4. Standard HF Trainer handles the actual training loop ----
training_args = TrainingArguments(
    output_dir="./qlora-run",
    per_device_train_batch_size=4,
    gradient_accumulation_steps=4,
    num_train_epochs=3,
    learning_rate=2e-4,
    fp16=False,
    bf16=True,
    logging_steps=10,
    save_strategy="epoch",
    report_to="wandb",  # ties into the W&B logging from the SOW
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=dataset,
    data_collator=DataCollatorForLanguageModeling(tokenizer, mlm=False),
)

trainer.train()

# ---- 5. Save just the adapter (a few MB, not the whole model) ----
model.save_pretrained("./qlora-adapter")
