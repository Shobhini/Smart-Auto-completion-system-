#include <bits/stdc++.h>
# include "TrieNode.h"
#include "Typos.h"
#include "FileHandler.h"

using namespace std;

// Windows color handling
class Color {
public:
    static const string RESET;
    static const string GREEN;
    static const string YELLOW;
    static const string BLUE;
    static const string CYAN;
    static const string RED;
};

// Define the static const strings
const string Color::RESET = "\033[0m";
const string Color::GREEN = "\033[32m";
const string Color::YELLOW = "\033[33m";
const string Color::BLUE = "\033[34m";
const string Color::CYAN = "\033[36m";
const string Color::RED = "\033[31m";

string TrieNode::probableMistake(char c) {
    Typos *findTypo = new Typos();
    return findTypo -> neighbours[c];
}

void TrieNode::insertHistory(string word) {
    if (child.find(word[0]) == child.end()) {
        child[word[0]] = new TrieNode();
    }
    TrieNode *current = child[word[0]];
    int wordLength = word.length();
    for (int i = 1; i < wordLength; ++i) {
        ++current->search_frequency;
        if (current->child.find(word[i]) == current->child.end()) {
            current->child[word[i]] = new TrieNode();
        }
        current = current->child[word[i]];
    }
    if (!current->isWord)
        current->isWord = true;
    ++current->search_frequency;
}

vector<string> TrieNode::bfsSearch(string word) {
    vector<string> suggestions;
    TrieNode *current = this;

    if(child.find(word[0]) == child.end()) {
        string qwerty = probableMistake(word[0]);
        char letter;
        int frequency = -1;
        for (auto l : qwerty) {
            if (child.find(l) == child.end())
                continue;
            if (child[l]->search_frequency > frequency) {
                frequency = child[l]->search_frequency;
                letter = l;
            }
        }
        if (frequency != -1) {
            current = child[letter];
        } else
            return suggestions;;
    } else current = child[word[0]];
    int wordLength = word.length();
    for (int i = 1; i < wordLength; ++i) {
        if (current->child.find(word[i]) != current->child.end()) {
            current = current->child[word[i]];
            continue;
        }
        string qwerty = probableMistake(word[i]);
        char letter;
        int frequency = -1;
        for (auto l : qwerty) {
            if (current->child.find(l) == current->child.end())
                continue;
            if (current->child[l]->search_frequency > frequency) {
                frequency = current->child[l]->search_frequency;
                letter = l;
            }
        }
        if (frequency != -1) {
            current = current->child[letter];
        } else break;
    }
    priority_queue<pair<pair<int, string>, TrieNode *>> suggestionQueue;
    suggestionQueue.push({{current->search_frequency, ""}, current});
    while (suggestions.size() < 3 and !suggestionQueue.empty()) {
        auto currentNode = suggestionQueue.top();
        suggestionQueue.pop();
        if (currentNode.second->isWord) {
            suggestions.push_back(word + currentNode.first.second);
        }
        for (auto children : currentNode.second->child) {
            suggestionQueue.push({
                {children.second->search_frequency, currentNode.first.second + children.first},
                children.second
            });
        }
    }
    return suggestions;
}

void TrieNode::getAllWords(vector<string>& words, string current) {
    if (isWord) {
        words.push_back(current);
    }
    for (const auto& pair : child) {
        pair.second->getAllWords(words, current + pair.first);
    }
}

void TrieNode::displayColoredSuggestion(const string& prefix, const string& suggestion, int frequency) {
    cout << Color::BLUE << "→ " << Color::RESET;
    cout << Color::GREEN << prefix << Color::YELLOW << suggestion.substr(prefix.length()) 
         << Color::CYAN << " (frequency: " << frequency << ")" << Color::RESET << endl;
}

TrieNode::~TrieNode() {
    for (auto& pair : child) {
        delete pair.second;
    }
}

int main() {
    TrieNode *root = new TrieNode();
    
    // Load existing history
    vector<string> history = FileHandler::loadHistory(FileHandler::DEFAULT_HISTORY_FILE);
    for (const auto& word : history) {
        root->insertHistory(word);
    }

    cout << Color::CYAN << "=== Smart Auto-Completion System ===" << Color::RESET << endl;
    cout << Color::GREEN << "1" << Color::RESET << " Add word to history" << endl;
    cout << Color::GREEN << "2" << Color::RESET << " Get word suggestions" << endl;
    cout << Color::GREEN << "3" << Color::RESET << " Exit" << endl;
    
    int choice;
    string word;
    vector<string> newWords;

    while (true) {
        cout << "\n" << Color::YELLOW << "Enter your choice (1-3): " << Color::RESET;
        cin >> choice;

        if (choice == 3) {
            // Save all words before exiting
            vector<string> allWords;
            root->getAllWords(allWords, "");
            FileHandler::saveHistory(FileHandler::DEFAULT_HISTORY_FILE, allWords);
            break;
        }

        if (choice == 1) {
            cout << Color::YELLOW << "Enter word to add: " << Color::RESET;
            cin >> word;
            root->insertHistory(word);
            cout << Color::GREEN << "Word added successfully!" << Color::RESET << endl;
        }
        else if (choice == 2) {
            cout << Color::YELLOW << "Enter partial word: " << Color::RESET;
            cin >> word;
            vector<string> suggestions = root->bfsSearch(word);
            
            if (suggestions.empty()) {
                cout << Color::RED << "No suggestions found." << Color::RESET << endl;
            } else {
                cout << Color::CYAN << "\nSuggestions for '" << word << "':" << Color::RESET << endl;
                for (const auto& suggestion : suggestions) {
                    TrieNode* node = root;
                    for(char c: suggestion){
                        if(node->child.find(c) != node->child.end()){
                            node = node->child[c];
                        }else{
                            break;
                        }
                    }
                    root->displayColoredSuggestion(word, suggestion, node->search_frequency);
                }
            }
        }
        else {
            cout << Color::RED << "Wrong Choice!!!" << Color::RESET << endl;
        }
    }

    delete root;
    return 0;
}