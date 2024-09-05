import numpy as np
import os
import scipy.io
import matplotlib.pyplot as plt
from scipy import signal
from tkinter import Tk, filedialog, Button, Label, Frame
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split

# Define EEG bands and channel mappings
bands = {'alpha': (8, 13), 'delta': (0.5, 4), 'beta': (13, 30), 'gamma': (30, np.inf)}
channel_names = ['AF3', 'F7', 'F3', 'FC5', 'T7', 'P7', 'O1', 'O2', 'P8', 'T8', 'FC6', 'F4', 'F8', 'AF4']
channel_indices = np.array(range(3, 17))
channel_map = dict(zip(channel_names, channel_indices))

# Function to load and return EEG data from a .mat file
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

# Function to calculate power for different brainwave bands
def get_powers(channel, FS):
    channel = channel - channel.mean()
    freq, psd = signal.periodogram(channel, fs=FS, nfft=256)

    powers = {}
    for band_name, band_limits in bands.items():
        low, high = band_limits
        powers[band_name] = psd[(freq >= low) & (freq < high)].mean()
    return powers

# Function to load all .mat files from a folder, extract data, and train the ML model
def train_model():
    folder_path = filedialog.askdirectory(title="Select Folder with .mat Files")
    if not folder_path:
        print("No folder selected.")
        return None, None
    
    data = []
    labels = []

    for file_name in os.listdir(folder_path):
        if file_name.endswith(".mat"):
            file_path = os.path.join(folder_path, file_name)
            states, FS = get_data(file_path)
            
            for state, label in zip(['focused', 'unfocused', 'drowsy'], [0, 1, 2]):
                state_data = states[state]
                for channel_name in channel_names:
                    channel_idx = channel_map[channel_name]
                    powers = get_powers(state_data[:, channel_idx], FS)
                    data.append([powers['alpha'], powers['delta'], powers['beta'], powers['gamma']])
                    labels.append(label)

    data = np.array(data)
    labels = np.array(labels)

    scaler = StandardScaler()
    data = scaler.fit_transform(data)
    X_train, X_test, y_train, y_test = train_test_split(data, labels, test_size=0.3, random_state=42)

    clf = RandomForestClassifier()
    clf.fit(X_train, y_train)

    return clf, scaler

# Function to plot EEG data
def plot_eeg(data, FS, channel_name):
    time = np.arange(len(data)) / FS
    fig, ax = plt.subplots(figsize=(8, 5))
    ax.plot(time, data, color='b')
    ax.set_xlabel('Time (s)', color='black')
    ax.set_ylabel(f'EEG channel {channel_name}', color='black')
    ax.set_title(f'EEG Data - {channel_name}', color='black')
    ax.grid(True)
    return fig

# Function to analyze and display the EEG data
def analyze_eeg(file_path, clf, scaler):
    states, FS = get_data(file_path)

    channel_idx = channel_map['AF3']
    state_data = states['focused']  
    channel_data = state_data[:, channel_idx]

    fig = plot_eeg(channel_data[:1000], FS, 'AF3')

    global canvas
    canvas = FigureCanvasTkAgg(fig, master=window)
    canvas.draw()
    canvas.get_tk_widget().pack(pady=10)

    powers = get_powers(channel_data[:1000], FS)
    power_values = np.array([[powers['alpha'], powers['delta'], powers['beta'], powers['gamma']]])
    power_values = scaler.transform(power_values)
    
    state_prediction = clf.predict(power_values)[0]
    state_dict = {0: 'Focused', 1: 'Unfocused', 2: 'Drowsy'}

    result_label.config(text=f"Power Levels:\nAlpha: {powers['alpha']:.4f}\nDelta: {powers['delta']:.4f}\n"
                             f"Beta: {powers['beta']:.4f}\nGamma: {powers['gamma']:.4f}\n\n"
                             f"Predicted State: {state_dict[state_prediction]}", bg='lightyellow', fg='black', padx=10, pady=10)

# Function to handle file upload
def upload_file():
    file_path = filedialog.askopenfilename(filetypes=[("MAT files", "*.mat")])
    if file_path:
        analyze_eeg(file_path, clf, scaler)

# Function to reset the GUI (clear plot and labels)
def reset_gui():
    if canvas:
        canvas.get_tk_widget().pack_forget()
    result_label.config(text="Power Levels: ", bg='lightgray', fg='black')

# Train the ML model before starting the GUI
clf, scaler = train_model()

# GUI setup
window = Tk()
window.title("EEG Data Analyzer")
window.geometry("900x700")
window.configure(bg='lightblue')

# Organize layout with frames
frame_top = Frame(window, bg='lightblue')
frame_top.pack(pady=20)

upload_button = Button(frame_top, text="Upload EEG .mat File", command=upload_file, font=("Helvetica", 12), bg='royalblue', fg='black', padx=10, pady=5)
upload_button.pack(pady=10)

reset_button = Button(frame_top, text="Reset", command=reset_gui, font=("Helvetica", 12), bg='tomato', fg='black', padx=10, pady=5)
reset_button.pack(pady=10)

result_label = Label(frame_top, text="Power Levels: ", font=("Helvetica", 14), bg='lightgray', fg='black', padx=10, pady=10)
result_label.pack(pady=20)

# Start the GUI event loop
window.mainloop()
