import cv2

def generate_overlay(image,heatmap):
    overlay = cv2.addWeighted(image,0.7,heatmap,0.3,0)
    return overlay
