import json
from pathlib import Path

class MusicConfig:    
    def __init__(self, config_file="music_config.json"):
        self.config_file = Path("MIDI") / config_file
        self.default_config = self._get_default_config()
        self.config = self.load_config()
    
    def _get_default_config(self):
        return {
            "weather_mappings": { "Sunny": { "base_note": 60, "scale": [0, 2, 4, 5, 7, 9, 11], "scale_name": "C Major", "chord_type": "major", "tempo": 120, "velocity": 80, "instrument": 1, "instrument_name": "Acoustic Grand Piano", "octave_range": [4, 5, 6], "rhythm_pattern": [1, 0, 1, 0, 1, 0, 1, 0], "mood": "bright and uplifting" }, "Rainy": { "base_note": 57, "scale": [0, 2, 3, 5, 7, 8, 10], "scale_name": "A Minor", "chord_type": "minor", "tempo": 90, "velocity": 60, "instrument": 4, "instrument_name": "Electric Piano", "octave_range": [3, 4, 5], "rhythm_pattern": [1, 0, 0, 1, 0, 1, 0, 0], "mood": "melancholic and flowing" }, "Stormy": { "base_note": 55, "scale": [0, 1, 3, 5, 6, 8, 10], "scale_name": "G Phrygian", "chord_type": "diminished", "tempo": 140, "velocity": 110, "instrument": 33, "instrument_name": "Electric Bass", "octave_range": [2, 3, 4], "rhythm_pattern": [1, 1, 0, 1, 1, 0, 1, 1], "mood": "intense and dramatic" }, "Windy": { "base_note": 62, "scale": [0, 2, 4, 6, 7, 9, 11], "scale_name": "D Lydian", "chord_type": "sus4", "tempo": 110, "velocity": 70, "instrument": 73, "instrument_name": "Flute", "octave_range": [4, 5, 6, 7], "rhythm_pattern": [1, 0, 1, 1, 0, 1, 0, 1], "mood": "ethereal and floating" } }, "general_settings": { "sequence_length": 20, "feature_dim": 9, "smoothing_window": 5, "default_duration": 30, "beat_subdivision": 8, "chord_duration": 1.0, "melody_duration": 0.5, "transition_smoothing": True, "confidence_threshold": 0.6 }, "instrument_library": { 1: "Acoustic Grand Piano", 2: "Bright Acoustic Piano", 3: "Electric Grand Piano", 4: "Honky-tonk Piano", 5: "Electric Piano 1", 6: "Electric Piano 2", 7: "Harpsichord", 8: "Clavinet", 25: "Acoustic Guitar (nylon)", 26: "Acoustic Guitar (steel)", 27: "Electric Guitar (jazz)", 28: "Electric Guitar (clean)", 29: "Electric Guitar (muted)", 30: "Overdriven Guitar", 31: "Distortion Guitar", 32: "Guitar Harmonics", 33: "Acoustic Bass", 34: "Electric Bass (finger)", 35: "Electric Bass (pick)", 36: "Fretless Bass", 37: "Slap Bass 1", 38: "Slap Bass 2", 39: "Synth Bass 1", 40: "Synth Bass 2", 41: "Violin", 42: "Viola", 43: "Cello", 44: "Contrabass", 45: "Tremolo Strings", 46: "Pizzicato Strings", 47: "Orchestral Harp", 48: "Timpani", 49: "String Ensemble 1", 50: "String Ensemble 2", 51: "SynthStrings 1", 52: "SynthStrings 2", 53: "Choir Aahs", 54: "Voice Oohs", 55: "Synth Voice", 56: "Orchestra Hit", 57: "Trumpet", 58: "Trombone", 59: "Tuba", 60: "Muted Trumpet", 61: "French Horn", 62: "Brass Section", 63: "SynthBrass 1", 64: "SynthBrass 2", 65: "Soprano Sax", 66: "Alto Sax", 67: "Tenor Sax", 68: "Baritone Sax", 69: "Oboe", 70: "English Horn", 71: "Bassoon", 72: "Clarinet", 73: "Piccolo", 74: "Flute", 75: "Recorder", 76: "Pan Flute", 77: "Blown Bottle", 78: "Shakuhachi", 79: "Whistle", 80: "Ocarina" }, "scales": { "major": [0, 2, 4, 5, 7, 9, 11], "minor": [0, 2, 3, 5, 7, 8, 10], "dorian": [0, 2, 3, 5, 7, 9, 10], "phrygian": [0, 1, 3, 5, 7, 8, 10], "lydian": [0, 2, 4, 6, 7, 9, 11], "mixolydian": [0, 2, 4, 5, 7, 9, 10], "locrian": [0, 1, 3, 5, 6, 8, 10], "harmonic_minor": [0, 2, 3, 5, 7, 8, 11], "melodic_minor": [0, 2, 3, 5, 7, 9, 11], "pentatonic_major": [0, 2, 4, 7, 9], "pentatonic_minor": [0, 3, 5, 7, 10], "blues": [0, 3, 5, 6, 7, 10], "chromatic": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] }, "chord_types": { "major": [0, 4, 7], "minor": [0, 3, 7], "diminished": [0, 3, 6], "augmented": [0, 4, 8], "sus2": [0, 2, 7], "sus4": [0, 5, 7], "major7": [0, 4, 7, 11], "minor7": [0, 3, 7, 10], "dominant7": [0, 4, 7, 10], "diminished7": [0, 3, 6, 9], "major9": [0, 4, 7, 11, 14], "minor9": [0, 3, 7, 10, 14] }
            }
    
    def load_config(self):
        if self.config_file.exists():
            try:
                with open(self.config_file, 'r') as f:
                    config = json.load(f)
                print(f"Configuration loaded from {self.config_file}")
                return config
            except Exception as e:
                print(f"Error loading config: {e}, using default")
                return self.default_config
        else:
            self.save_config(self.default_config)
            return self.default_config
    
    def save_config(self, config=None):
        if config is None:
            config = self.config
        self.config_file.parent.mkdir(exist_ok=True)
        
        try:
            with open(self.config_file, 'w') as f:
                json.dump(config, f, indent=2)
            print(f"Configuration saved to {self.config_file}")
        except Exception as e:
            print(f"Error saving config: {e}")
    
    def get_weather_config(self, weather_class):
        return self.config["weather_mappings"].get(weather_class, self.config["weather_mappings"]["Sunny"])
    
    def get_general_settings(self):
        return self.config["general_settings"]
    
    def get_instrument_name(self, program):
        return self.config["instrument_library"].get(program, f"Unknown_{program}")
    
    def get_scale(self, scale_name):
        return self.config["scales"].get(scale_name, self.config["scales"]["major"])
    
    def get_chord_intervals(self, chord_type):
        return self.config["chord_types"].get(chord_type, self.config["chord_types"]["major"])
    
    def update_weather_config(self, weather_class, updates):
        if weather_class in self.config["weather_mappings"]:
            self.config["weather_mappings"][weather_class].update(updates)
            self.save_config()
        else:
            print(f"Weather class {weather_class} not found")
    
    def add_custom_weather(self, weather_class, config):
        self.config["weather_mappings"][weather_class] = config
        self.save_config()
        print(f"Added custom weather class: {weather_class}")
    
    def print_config_summary(self):
        print("\n" + "="*60)
        print("MUSICAL CONFIGURATION SUMMARY")
        print("="*60)
        
        for weather, config in self.config["weather_mappings"].items():
            print(f"\n{weather.upper()}:")
            print(f"  Scale: {config['scale_name']}")
            print(f"  Instrument: {config['instrument_name']}")
            print(f"  Tempo: {config['tempo']} BPM")
            print(f"  Chord Type: {config['chord_type']}")
            print(f"  Mood: {config['mood']}")
        
        print(f"\nGeneral Settings:")
        settings = self.config["general_settings"]
        print(f"  Sequence Length: {settings['sequence_length']}")
        print(f"  Smoothing Window: {settings['smoothing_window']}")
        print(f"  Default Duration: {settings['default_duration']} seconds")
        print(f"  Transition Smoothing: {settings['transition_smoothing']}")


class ConfigEditor:
    def __init__(self, config_manager):
        self.config = config_manager
    
    def interactive_edit(self):
        print("\n" + "="*50)
        print("INTERACTIVE CONFIGURATION EDITOR")
        print("="*50)
        
        while True:
            print("\nOptions:")
            print("1. View current configuration")
            print("2. Edit weather class")
            print("3. Add new weather class")
            print("4. Edit general settings")
            print("5. Export configuration")
            print("6. Exit")    
            choice = input("\nEnter your choice (1-6): ").strip()
            if choice == '1':
                self.config.print_config_summary()
            elif choice == '2':
                self.edit_weather_class()
            elif choice == '3':
                self.add_weather_class()
            elif choice == '4':
                self.edit_general_settings()
            elif choice == '5':
                self.export_config()
            elif choice == '6':
                break
            else:
                print("Invalid choice. Please try again.")
    
    def edit_weather_class(self):
        weather_classes = list(self.config.config["weather_mappings"].keys())
        print("\nAvailable weather classes:")
        for i, weather in enumerate(weather_classes, 1):
            print(f"{i}. {weather}")
        
        try:
            choice = int(input("Select weather class to edit: ")) - 1
            if 0 <= choice < len(weather_classes):
                weather_class = weather_classes[choice]
                self.edit_weather_parameters(weather_class)
            else:
                print("Invalid choice.")
        except ValueError:
            print("Please enter a valid number.")
    
    def edit_weather_parameters(self, weather_class):
        current_config = self.config.get_weather_config(weather_class)
        print(f"\nEditing {weather_class}:")
        print("Enter new values (press Enter to keep current value):")
        updates = {}
        for param in ['base_note', 'tempo', 'velocity', 'instrument']:
            current_value = current_config[param]
            new_value = input(f"{param} (current: {current_value}): ").strip()
            if new_value:
                try:
                    updates[param] = int(new_value)
                except ValueError:
                    print(f"Invalid value for {param}, keeping current value.")
        
        available_chords = list(self.config.config["chord_types"].keys())
        print(f"\nAvailable chord types: {', '.join(available_chords)}")
        chord_type = input(f"chord_type (current: {current_config['chord_type']}): ").strip()
        if chord_type and chord_type in available_chords:
            updates['chord_type'] = chord_type
        available_scales = list(self.config.config["scales"].keys())
        print(f"\nAvailable scales: {', '.join(available_scales)}")
        scale_input = input("Enter scale name: ").strip()
        if scale_input and scale_input in available_scales:
            updates['scale'] = self.config.get_scale(scale_input)
            updates['scale_name'] = scale_input
        
        if updates:
            self.config.update_weather_config(weather_class, updates)
            print(f"Updated {weather_class} configuration.")
        else:
            print("No changes made.")
    
    def add_weather_class(self):
        name = input("Enter new weather class name: ").strip()
        if not name:
            print("Name cannot be empty.")
            return
        
        if name in self.config.config["weather_mappings"]:
            print(f"Weather class '{name}' already exists.")
            return
        
        weather_classes = list(self.config.config["weather_mappings"].keys())
        print("Select template to copy from:")
        for i, weather in enumerate(weather_classes, 1):
            print(f"{i}. {weather}")
        
        try:
            choice = int(input("Select template: ")) - 1
            if 0 <= choice < len(weather_classes):
                template = weather_classes[choice]
                new_config = self.config.get_weather_config(template).copy()
                new_config['mood'] = f"custom mood for {name}"
                
                self.config.add_custom_weather(name, new_config)
                
                
                edit_now = input("Edit parameters now? (y/n): ").strip().lower()
                if edit_now == 'y':
                    self.edit_weather_parameters(name)
            else:
                print("Invalid choice.")
        except ValueError:
            print("Please enter a valid number.")
    
    def edit_general_settings(self):
        settings = self.config.get_general_settings()
        print("\nEditing general settings:")
        print("Enter new values (press Enter to keep current value):")
        
        updates = {}
        for param in ['sequence_length', 'smoothing_window', 'default_duration']:
            current_value = settings[param]
            new_value = input(f"{param} (current: {current_value}): ").strip()
            if new_value:
                try:
                    updates[param] = int(new_value)
                except ValueError:
                    print(f"Invalid value for {param}, keeping current value.")
        
        
        for param in ['transition_smoothing']:
            current_value = settings[param]
            new_value = input(f"{param} (current: {current_value}) [y/n]: ").strip().lower()
            if new_value in ['y', 'yes', 'true']:
                updates[param] = True
            elif new_value in ['n', 'no', 'false']:
                updates[param] = False
        
        if updates:
            self.config.config["general_settings"].update(updates)
            self.config.save_config()
            print("Updated general settings.")
        else:
            print("No changes made.")
    
    def export_config(self):
        filename = input("Enter filename for export (e.g., my_config.json): ").strip()
        if not filename:
            filename = "exported_config.json"
        
        if not filename.endswith('.json'):
            filename += '.json'
        export_path = Path("MIDI") / filename
        
        try:
            with open(export_path, 'w') as f:
                json.dump(self.config.config, f, indent=2)
            print(f"Configuration exported to {export_path}")
        except Exception as e:
            print(f"Error exporting configuration: {e}")

def main():
    print("Testing Musical Configuration System...")
    config_manager = MusicConfig()
    config_manager.print_config_summary()
    sunny_config = config_manager.get_weather_config("Sunny")
    print(f"\nSunny configuration: {sunny_config}")
    instrument_name = config_manager.get_instrument_name(1)
    print(f"Instrument 1: {instrument_name}")
    editor = ConfigEditor(config_manager)
    print("\nConfiguration system test completed!")

if __name__ == "__main__":
    main()
