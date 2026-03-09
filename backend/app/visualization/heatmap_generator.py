import cv2

def generate_heatmap(diff):
    heatmap = cv2.applyColorMap(
        cv2.normalize(diff,None,0,255,cv2.NORM_MINMAX).astype("uint8"),
        cv2.COLORMAP_JET
    )
    return heatmap
