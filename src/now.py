from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
from PIL import Image
import io
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS

# Load your pre-trained skin cancer detection model
model = tf.keras.models.load_model('C:\\Users\\TONY\\Documents\\KOMEFRONTEND\\Mallet Skin.h5')  

class_names = ['Actinic keratoses and intraepithelial carcinomae', 'basal cell carcinoma',
               'benign keratosis-like lesions', 'dermatofibroma', 'Melanocytic nevi',
               'pyogenic granulomas and hemorrhage', 'Melanoma']

@app.route('/predict', methods=['POST'])
def predict_skin_cancer():
    if 'image' not in request.files:
        return jsonify('Error: No image uploaded.')

    image_file = request.files['image']
    image = Image.open(io.BytesIO(image_file.read()))
    image = image.resize((28, 28))  # Resize to the expected input shape
    img = np.array(image).reshape(-1, 28, 28, 3)  # Convert to NumPy array and reshape

    result = model.predict(img)

    if len(result.shape) == 2:
        result = result[0]

    max_prob = np.max(result) * 100
    class_ind = np.argmax(result)
    predicted_class = class_names[class_ind]

    return jsonify(f"Predicted Class: {predicted_class} (Confidence: {max_prob:.1f}%)")

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
