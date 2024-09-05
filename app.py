from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import scipy.io
import numpy as np
import matplotlib.pyplot as plt
from io import BytesIO
from scipy import signal

app = Flask(__name__)
CORS(app)  # To allow cross-origin requests

# Define EEG bands and channel information
bands = {'alpha': (8, 13), 'delta': (0.5, 4), 'beta': (13, 30), 'gamma': (30, np.inf)}
channel_names = ['AF3', 'F7', 'F3', 'FC5', 'T7', 'P7', 'O1', 'O2', 'P8', 'T8', 'FC6', 'F4', 'F8', 'AF4']
channel_indices = np.array(range(3, 17))
channel_map = dict(zip(channel_names, channel_indices))

def get_data(file_path):
    mat = scipy.io.loadmat(file_path)
    data = mat['o']['data'][0, 0]
    FS = mat['o']['sampFreq'][0][0][0][0]

    states = {
        'focused': data[:FS * 10 * 60, :],
        'unfocused': data[FS * 10 * 60:FS * 20 * 60, :],
        'drowsy': data[FS * 30 * 60:, :],
    }
    return states, FS

def get_powers(channel, FS):
    channel = channel - channel.mean()
    freq, psd = signal.periodogram(channel, fs=FS, nfft=256)
    powers = {}
    for band_name, band_limits in bands.items():
        low, high = band_limits
        powers[band_name] = psd[(freq >= low) & (freq < high)].mean()
    return powers

def plot_eeg(data, FS, channel_name):
    time = np.arange(len(data)) / FS
    fig, ax = plt.subplots(figsize=(6, 4))
    ax.plot(time, data)
    ax.set_xlabel('Time (s)')
    ax.set_ylabel(f'EEG channel {channel_name}')
    ax.set_title(f'EEG Data - {channel_name}')
    return fig

@app.route('/upload', methods=['POST'])
def upload_file():
    file = request.files['file']
    if file:
        file_path = 'uploaded.mat'
        file.save(file_path)
        
        states, FS = get_data(file_path)
        channel_idx = channel_map['AF3']
        state_data = states['focused']
        channel_data = state_data[:, channel_idx]

        fig = plot_eeg(channel_data[:1000], FS, 'AF3')
        buf = BytesIO()
        fig.savefig(buf, format='png')
        buf.seek(0)

        powers = get_powers(channel_data[:1000], FS)

        return jsonify({
            'powers': powers,
            'image': buf.getvalue().decode('latin-1')  # Return image data as a string
        })

    return jsonify({'error': 'No file uploaded'}), 400

if __name__ == "__main__":
    app.run(debug=True, port=5001)  # Change the port to 5001 or any other available port

