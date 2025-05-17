#include "FileHandler.h"
#include <iostream>

const std::string FileHandler::DEFAULT_HISTORY_FILE = "search_history.txt";


void FileHandler::saveHistory(const std::string& filename, const std::vector<std::string>& words) {
    std::ofstream file(filename);
    if (!file.is_open()) {
        std::cerr << "Error: Could not open file for writing: " << filename << std::endl;
        return;
    }
    for (const auto& word : words) {
        file << word << "\n";
    }
    file.close();
}

std::vector<std::string> FileHandler::loadHistory(const std::string& filename) {
    std::vector<std::string> words;
    std::ifstream file(filename);
    if (!file.is_open()) {
        return words;
    }
    std::string word;
    while (std::getline(file, word)) {
        if (!word.empty()) {
            words.push_back(word);
        }
    }
    file.close();
    return words;
} 