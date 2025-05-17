#pragma once
#ifndef FILEHANDLER_H
#define FILEHANDLER_H

#include <fstream>
#include <string>
#include <vector>

namespace Color {
    // Windows-compatible color codes
    const std::string RESET = "";
    const std::string RED = "";
    const std::string GREEN = "";
    const std::string YELLOW = "";
    const std::string BLUE = "";
    const std::string CYAN = "";
}

class FileHandler {
public:
    static const std::string DEFAULT_HISTORY_FILE;
    static void saveHistory(const std::string& filename, const std::vector<std::string>& words);
    static std::vector<std::string> loadHistory(const std::string& filename);
};

#endif 