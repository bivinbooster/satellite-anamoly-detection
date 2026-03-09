import torch
import numpy as np
from app.inference.change_model import SimpleChangeModel

model = SimpleChangeModel()
model.eval()

def run_inference(img1,img2):
    img1 = torch.tensor(img1).permute(2,0,1).unsqueeze(0).float()/255
    img2 = torch.tensor(img2).permute(2,0,1).unsqueeze(0).float()/255

    with torch.no_grad():
        diff = model(img1,img2)

    diff = diff.squeeze().mean(0).numpy()
    anomaly_percent = (diff > diff.mean()).mean() * 100

    return diff, anomaly_percent
