import torch
import torch.nn as nn

class SimpleChangeModel(nn.Module):
    def __init__(self):
        super().__init__()
        self.encoder = nn.Sequential(
            nn.Conv2d(3,16,3,padding=1),
            nn.ReLU(),
            nn.Conv2d(16,32,3,padding=1),
            nn.ReLU()
        )

    def forward(self,img1,img2):
        f1 = self.encoder(img1)
        f2 = self.encoder(img2)
        diff = torch.abs(f1 - f2)
        return diff
