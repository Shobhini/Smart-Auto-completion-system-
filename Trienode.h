#ifndef TRIENODE_H
#define TRIENODE_H

#include <unordered_map>
#include <vector>
#include <string>
#include <queue>
#include <windows.h>
#include <iostream>

using namespace std;

// // Windows color handling
// class Color {
// public:
//     static const string RESET;
//     static const string GREEN;
//     static const string YELLOW;
//     static const string BLUE;
//     static const string CYAN;
//     static const string RED;
// };

// Define the static const strings
// const string Color::RESET = "\033[0m";
// const string Color::GREEN = "\033[32m";
// const string Color::YELLOW = "\033[33m";
// const string Color::BLUE = "\033[34m";
// const string Color::CYAN = "\033[36m";
// const string Color::RED = "\033[31m";

class TrieNode {
public:
    std::unordered_map<char, TrieNode*> child;
    int search_frequency = 0;
    bool isWord = false;

    //Constructor
    TrieNode() : search_frequency(0), isWord(false) {}

    void insertHistory(string word);
    vector<string> bfsSearch(string word);
    string probableMistake(char c);
    
    // New functions
    void getAllWords(vector<string>& words, string current = "");
    static void displayColoredSuggestion(const string& prefix, const string& suggestion, int frequency) ;
    //     cout << Color::BLUE << "→ " << Color::RESET;
    //     cout << Color::GREEN << prefix << Color::RESET;
    //     cout << Color::YELLOW << suggestion.substr(prefix.length()) << Color::RESET;
    //     cout << Color::CYAN << " (frequency: " << frequency << ")" << Color::RESET << endl;
    // }
    
    // Destructor to properly clean up the trie
    ~TrieNode();
};

#endif