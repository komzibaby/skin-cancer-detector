import React, { useState } from 'react';
import axios from 'axios';
import { Button, Typography, CircularProgress, Card, CardMedia, CardContent, Container } from '@mui/material';
import { styled } from '@mui/system';

const StyledContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  backgroundColor: '#f0f4f8',
  padding: '20px',
});

const Title = styled(Typography)({
  marginBottom: '20px',
  fontFamily: 'Roboto, sans-serif',
  color: '#3f51b5',
  fontWeight: 700,
});

const StyledButton = styled(Button)({
  marginTop: '20px',
});

const ImagePreview = styled(Card)({
  marginTop: '20px',
  maxWidth: '400px',
});

const PredictionText = styled(Typography)({
  marginTop: '20px',
  fontFamily: 'Roboto, sans-serif',
  fontSize: '18px',
  fontWeight: 500,
});

const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setPrediction(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      console.log('No image selected');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);

    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      console.log('Sending request to backend');
      const response = await axios.post('http://localhost:5000/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Response received:', response.data);
      setPrediction(response.data);
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Error: Could not process the image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledContainer>
      <Title variant="h4">SkinGuard - Skin Cancer Detection</Title>
      <input
        accept="image/*"
        type="file"
        onChange={handleImageChange}
        id="fileInput"
        style={{ display: 'none' }}
      />
      <label htmlFor="fileInput">
        <StyledButton variant="contained" component="span" color="primary">
          Choose Image
        </StyledButton>
      </label>
      <StyledButton variant="contained" color="secondary" onClick={handleSubmit} disabled={!image}>
        Upload and Predict
      </StyledButton>
      {loading && <CircularProgress sx={{ mt: 2 }} />}
      {imagePreview && (
        <ImagePreview>
          <CardMedia component="img" image={imagePreview} alt="Uploaded Image" />
          <CardContent>
            <Typography variant="body2" color="textSecondary" component="p">
              Uploaded Image
            </Typography>
          </CardContent>
        </ImagePreview>
      )}
      {prediction && (
        <PredictionText variant="h6">{prediction}</PredictionText>
      )}
      {error && (
        <PredictionText variant="h6" style={{ color: 'red' }}>{error}</PredictionText>
      )}
    </StyledContainer>
  );
};

export default ImageUpload;